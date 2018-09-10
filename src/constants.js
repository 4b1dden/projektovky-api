module.exports = {
    SERVER: {
        REQ_URL_PREFIX: ""
    },
    DB: {
        URI: "mongodb://projektovky:projekt0vky@ds251332.mlab.com:51332/heroku_j38mt8lx", 
        COLLECTIONS: {
            PROJECTS: "projects",
            GROUPS: "groups",
            USERS: "users",
            SESSIONS: "sessions",
            MEMBERSHIPS: "memberships"
        }
    },
    JWT: {
        SECRET_KEY: "ccb248c3-57d9-4fd1-ae16-8c2736e84054",
        DEFAULT_EXPIRATION: 1000 * 60 * 60 * 24 * 7
    },
    RESPONSE: { 
        NOT_AUTHORIZED: "NOT_AUTHORIZED",
        EMPTY_FIELD: "EMPTY_FIELD",
        MISSING_DATA: "MISSING_DATA",
        WRONG_CREDENTIALS: "WRONG_CREDENTIALS",
        USER_NOT_FOUND: "USER_NOT_FOUND",
        EMAIL_OCCUPIED: "EMAIL_OCCUPIED",
        NO_TOKEN_PROVIDED: "NO_TOKEN_PROVIDED",
        INVALID_TOKEN: "INVALID_TOKEN",
        DATA_NOT_FOUND: "DATA_NOT_FOUND",
        NO_DATA: "NO_DATA",
        WRONG_EMAIL_FORMAT: "WRONG_EMAIL_FORMAT",
        NO_REAL_VALUE: "NO_REAL_VALUE",
        API_CALL_ERROR: "API_CALL_ERROR",
        NOT_FOUND: "NOT_FOUND",
        MISSING_AUDIT_ID: "MISSING_AUDIT_ID",
        MISSING_CONTRACT_ID: "MISSING_CONTRACT_ID",
        MISSING_EVENT_ID: "MISSING_EVENT_ID",
        MISSING_USER_ID: "MISSING_USER_ID",
        COULD_NOT_SAVE: "COULD_NOT_SAVE",
        REMOVAL_ERROR: "REMOVAL_ERROR",
        MISSING_IDS: "MISSING_IDS",
        NONPROFIT_NOT_FOUND: "NONPROFIT_NOT_FOUND",
        ACCOUNT_NOT_FOUND: "ACCOUNT_NOT_FOUND",
        EMAIL_NOT_FOUND: "EMAIL_NOT_FOUND",
        NO_TOKEN_PROVIDED: "NO_TOKEN_PROVIDED",
        INCORRECT_RESET_CODE: "INCORRECT_RESET_CODE"
    },
    GROUP_STATES: {
        INVITE_DECLINED: -1,
        LEFT: 0,
        PENDING_INVITE: 1,
        ACCEPTED: 2
    },
    SSH: {
        TIMEOUT_LIMIT: 3000,
        HOST_URL: "smnd.sk"
    },
    PASSWD_ENUMERABLES: {
        USERNAME: 0,
        PASSWORD: 1,
        UID: 2,
        GID: 3,
        FULL_NAME: 4,
        HOME_DIRECTORY: 5,
        SHELL_DIRECTORY: 6
    },
    ROLES: {
        STUDENT: {
            slug: "student",
            full: "Študent"
        },
        TEACHER: {
            slug: "teacher",
            full: "Učiteľ"
        },
        CONSULTANT: {
            slug: "consultant",
            full: "Konzultant"
        }
    },
}