export const NEEDS_UPDATE = 'needupdate';

export const accountRenewalFields = {
    school: {
        key: 'school',
        title: 'Update your School',
        reason: 'Wrong school',
    },
    course: {
        key: 'course',
        title: 'Update your Course',
        reason: 'Wrong course',
    },
    yearLevel: {
        key: 'yearLevel',
        aliases: ['yearlevel', 'year_level'],
        title: 'Update your Year Level',
        reason: 'Wrong year level',
    },
    schoolId: {
        key: 'schoolId',
        aliases: ['schoolID', 'studentId', 'studentID', 'school_id', 'student_id'],
        title: 'Update School ID',
        reason: 'Wrong school ID or student ID',
    },
    fullName: {
        key: 'fullName',
        aliases: ['fullname', 'full_name', 'name'],
        title: 'Update your Full Name',
        reason: 'Wrong name',
    },
    document: {
        key: 'document',
        aliases: ['proofOfEnrollment', 'proof_of_enrollment', 'file'],
        title: 'Upload your Document',
        reason: 'Wrong document',
    },
};

const truthyUpdateValues = new Set([
    NEEDS_UPDATE,
    'needsupdate',
    'needs_update',
    'renew',
    'renewal',
    'wrong',
    'invalid',
    'required',
]);

function needsUpdate(value) {
    if (value === true) return true;
    if (typeof value !== 'string') return false;

    return truthyUpdateValues.has(value.trim().toLowerCase());
}

function getStatusValue(source, field) {
    const keys = [field.key, ...(field.aliases ?? [])];
    const sourceKeys = Object.keys(source ?? {});

    for (const key of keys) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            return source[key];
        }

        const matchedKey = sourceKeys.find((sourceKey) => sourceKey.toLowerCase() === key.toLowerCase());
        if (matchedKey) {
            return source[matchedKey];
        }
    }

    return undefined;
}

export function getAccountRenewalRequirements(statuses = {}) {
    return Object.values(accountRenewalFields).filter((field) => needsUpdate(getStatusValue(statuses, field)));
}

export function hasAccountRenewalRequirements(statuses = {}) {
    return getAccountRenewalRequirements(statuses).length > 0;
}
