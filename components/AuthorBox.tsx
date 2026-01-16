import Image from 'next/image';
import { Author } from '@/lib/authors';

interface AuthorBoxProps {
    author: Author;
}

export default function AuthorBox({ author }: AuthorBoxProps) {
    return (
        <div className="mt-12 pt-8 border-t border-slate-800">
            <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden bg-slate-800">
                    <Image
                        src={author.avatarPath}
                        alt={author.name}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white">{author.name}</h3>
                        <span className="text-sm text-slate-500">•</span>
                        <span className="text-sm text-brand-400">{author.role}</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-3">
                        {author.bio}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {author.expertise.map((skill) => (
                            <span
                                key={skill}
                                className="px-2 py-1 text-xs bg-slate-900 text-slate-400 rounded border border-slate-800"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
