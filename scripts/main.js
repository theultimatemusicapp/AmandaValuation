import { initNavigation } from './navigation.js';
import * as validation from './validation.js';
import { calculateValuation } from './valuation.js';

validation.setupValidationListeners();
initNavigation(validation, calculateValuation);
