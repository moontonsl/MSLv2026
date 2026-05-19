export const SCHOOL_FORM_FIELDS = [
    { name: 'school', label: 'School Name', placeholder: 'e.g. Laguna University' },
    { name: 'municipality', label: 'Municipality', placeholder: 'e.g. Santa Cruz' },
    { name: 'region', label: 'Region', placeholder: 'e.g. Region IV-A' },
    { name: 'schoolType', label: 'School Type', placeholder: 'e.g. State University' },
];

export const COURSE_FORM_FIELDS = [
    {
        name: 'course',
        label: 'Course Name',
        placeholder: 'e.g Bachelor of Science in Information Technology',
    },
];

export const STRAND_FORM_FIELDS = [
    {
        name: 'strand',
        label: 'Strand Name',
        placeholder: 'e.g Science, Technology, Engineering, and Mathematics (STEM)',
    },
];

export const FORM_MODAL_CONFIG = {
    'add-school': {
        title: 'Add School',
        fields: SCHOOL_FORM_FIELDS,
        submitLabel: 'Submit',
        successType: 'success-school-added',
    },
    'edit-school': {
        title: 'Edit School',
        fields: SCHOOL_FORM_FIELDS,
        submitLabel: 'Update',
        successType: 'success-school-updated',
    },
    'add-course': {
        title: 'Add Course',
        fields: COURSE_FORM_FIELDS,
        submitLabel: 'Submit',
        successType: 'success-course-added',
    },
    'edit-course': {
        title: 'Edit Course',
        fields: COURSE_FORM_FIELDS,
        submitLabel: 'Update',
        successType: 'success-course-updated',
    },
    'add-strand': {
        title: 'Add Strand',
        fields: STRAND_FORM_FIELDS,
        submitLabel: 'Submit',
        successType: 'success-strand-added',
    },
    'edit-strand': {
        title: 'Edit Strand',
        fields: STRAND_FORM_FIELDS,
        submitLabel: 'Update',
        successType: 'success-strand-updated',
    },
};

export const SUCCESS_MESSAGES = {
    'success-school-added': 'School Successfully Added!',
    'success-school-updated': 'Updated Successfully!',
    'success-course-added': 'Course Successfully Added!',
    'success-course-updated': 'Updated Successfully!',
    'success-strand-added': 'Strand Successfully Added!',
    'success-strand-updated': 'Updated Successfully!',
};

export function isFormModal(type) {
    return type != null && type in FORM_MODAL_CONFIG;
}

export function isSuccessModal(type) {
    return type != null && type in SUCCESS_MESSAGES;
}
