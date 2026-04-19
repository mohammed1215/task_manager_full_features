export enum SortBy {
    CREATED_AT = 'createdAt',
    DUE_DATE = 'dueDate',
    PRIORITY = 'priority',
    UPDATED_AT = 'updatedAt',
}
export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC',
}
export enum NotificationTypes {
    TASK_ASSIGNED = 'TASK_ASSIGNED',
    USER_MENTIONED = 'USER_MENTIONED',
    TASK_DUE_SOON = 'TASK_DUE_SOON', // 24 hours
    TASK_OVERDUE = 'TASK_OVERDUE',
    WORKSPACE_INVITATION = 'WORKSPACE_INVITATION',
    WATCHED_TASK_COMMENT = 'WATCHED_TASK_COMMENT',
    TASK_UNASSIGNED = 'TASK_UNASSIGNED',
    TASK_CREATED = 'TASK_CREATED',
}

export enum EmailPreference {
    IMMEDIATE = 'immediate',
    DAILY_DIGEST = 'daily_digest',
    DISABLED = 'disabled',
}

export enum ActivityTypes {
    created = 'created',
    updated = 'updated',
    assigned = 'assigned',
    moved = 'moved',
    commented = 'commented',
    attachmentAdded = 'attachmentAdded',
}

export enum BoardFilter {
    ALL = 'all',
    ARCHIVED = 'archived',
    ACTIVE = 'active',
}
export enum BoardRoles {
    ADMIN = 'ADMIN',
    VIEWER = 'VIEWER',
    MEMBER = 'MEMBER',
}
export enum Visibility {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
    WORKSPACE = 'WORKSPACE',
}
export enum SearchTypes {
    TASKS = 'TASKS',
    BOARDS = 'BOARDS',
    ALL = 'ALL',
}
export enum PriorityTask {
    low = 'low',
    medium = 'medium',
    high = 'high',
    urgent = 'urgent',
}
export enum WorkspaceMemberRoles {
    owner = 'owner',
    admin = 'admin',
    member = 'member',
    viewer = 'viewer',
}
