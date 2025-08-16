import { initNavigation } from './navigation.js';
import * as validation from './validation.js';
import { calculateValuation } from './valuation.js';
import { initExplanations } from './explanations.js';

validation.setupValidationListeners();
initExplanations();
initNavigation(validation, calculateValuation);
