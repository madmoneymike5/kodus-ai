import { AutomationStatus } from '@libs/automation/domain/automation/enum/automation-status';

export interface CodeReviewAutomationResult {
    status: AutomationStatus;
    message: string;
}
