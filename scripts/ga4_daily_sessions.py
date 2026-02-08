#!/usr/bin/env python3
"""Fetch daily GA4 sessions segmented by traffic source and output to CSV.

Requires Google Analytics Data API (GA4) and application credentials.

Usage:
  python scripts/ga4_daily_sessions.py \
    --property-id 123456789 \
    --output ga4_sessions.csv

Environment:
  GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import os
import sys
from typing import Iterable

from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange,
    Dimension,
    Filter,
    FilterExpression,
    FilterExpressionList,
    Metric,
    RunReportRequest,
)
from google.api_core.exceptions import GoogleAPICallError, RetryError

CHANNEL_GROUPS = ["Organic Search", "Direct", "Referral"]


def build_request(property_id: str, start_date: str, end_date: str) -> RunReportRequest:
    return RunReportRequest(
        property=f"properties/{property_id}",
        dimensions=[
            Dimension(name="date"),
            Dimension(name="sessionDefaultChannelGroup"),
        ],
        metrics=[Metric(name="sessions")],
        date_ranges=[DateRange(start_date=start_date, end_date=end_date)],
        dimension_filter=FilterExpression(
            and_group=FilterExpressionList(
                expressions=[
                    FilterExpression(
                        filter=Filter(
                            field_name="sessionDefaultChannelGroup",
                            in_list_filter=Filter.InListFilter(values=CHANNEL_GROUPS),
                        )
                    )
                ]
            )
        ),
    )


def fetch_sessions(
    client: BetaAnalyticsDataClient, property_id: str, start_date: str, end_date: str
) -> Iterable[tuple[str, str, int]]:
    request = build_request(property_id, start_date, end_date)
    response = client.run_report(request)

    for row in response.rows:
        date_value = row.dimension_values[0].value
        channel_group = row.dimension_values[1].value
        sessions = int(row.metric_values[0].value)
        yield date_value, channel_group, sessions


def write_csv(output_path: str, rows: Iterable[tuple[str, str, int]]) -> None:
    with open(output_path, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["date", "traffic_source", "sessions"])
        writer.writerows(rows)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Fetch daily GA4 sessions for the last 60 days segmented by traffic source."
    )
    parser.add_argument("--property-id", required=True, help="GA4 property ID (numbers only).")
    parser.add_argument(
        "--output",
        default="ga4_daily_sessions.csv",
        help="Output CSV file path (default: ga4_daily_sessions.csv).",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    if not os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"):
        print(
            "Error: GOOGLE_APPLICATION_CREDENTIALS is not set. Provide a service account JSON path.",
            file=sys.stderr,
        )
        return 1

    today = dt.date.today()
    start_date = (today - dt.timedelta(days=59)).strftime("%Y-%m-%d")
    end_date = today.strftime("%Y-%m-%d")

    try:
        client = BetaAnalyticsDataClient()
        rows = list(fetch_sessions(client, args.property_id, start_date, end_date))
    except (GoogleAPICallError, RetryError) as exc:
        print(f"Error: GA4 API request failed: {exc}", file=sys.stderr)
        return 1
    except Exception as exc:  # pragma: no cover - catch-all for unexpected issues
        print(f"Error: Unexpected failure: {exc}", file=sys.stderr)
        return 1

    if not rows:
        print("Warning: No data returned for the given date range.", file=sys.stderr)

    write_csv(args.output, rows)
    print(f"Wrote {len(rows)} rows to {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
