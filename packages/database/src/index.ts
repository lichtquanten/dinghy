export { User, getUserModel } from "./models/user.js"

export {
    Assignment,
    TestCase,
    getAssignmentModel,
    defineAssignment,
    toPublicAssignment,
} from "./models/assignment.js"

export { Submission, getSubmissionModel } from "./models/submission.js"

export {
    Progress,
    getUserProgressModel,
    defineProgress,
} from "./models/progress.js"

// Types - User
export {
    USER_STATUSES,
    type UserStatus,
    type User as UserType,
    type UserPublic,
} from "./types/user.js"

export {
    CODE_LANGUAGES,
    ASSIGNMENT_STATUSES,
    type CodeLanguageKey,
    type AssignmentStatus,
    type TestCase as TestCaseType,
    type PublicTestCase,
    type Assignment as AssignmentType,
    type AssignmentPublic,
} from "./types/assignment.js"

export {
    SUBMISSION_STATUSES,
    type SubmissionStatus,
    type TestResult,
} from "./types/submission.js"

export { assignments } from "./seed/index.js"
