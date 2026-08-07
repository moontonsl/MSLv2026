import CourseModal from '@/Components/Admin/CourseModal';
import DeleteConfirmationModal from '@/Components/Admin/DeleteConfirmationModal';
import SchoolModal from '@/Components/Admin/SchoolModal';
import StrandModal from '@/Components/Admin/StrandModal';
import SuccessModal from '@/Components/Admin/SuccessModal';
import AdminTable from '@/Components/Admin/AdminTable';
import {
    COURSE_COLUMNS,
    COURSES_DATA,
    getCourseTrackOptions,
    SCHOOL_COLUMNS,
    SCHOOLS_DATA,
    STRAND_COLUMNS,
    STRANDS_DATA,
} from '@/data/adminAccountData';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useCallback, useMemo, useState } from 'react';

function mapSchoolFormToRow(values, existingRow = null) {
    const [municipality = '', region = ''] = values.locationRegion
        .split(',')
        .map((part) => part.trim());

    return {
        id: existingRow?.id ?? Date.now(),
        school: values.schoolName,
        municipality: municipality || values.locationRegion,
        region: region || values.locationRegion,
        schoolType: existingRow?.schoolType ?? 'State University',
        schoolCode: values.schoolCode,
        logo: values.logo,
    };
}

function mapCourseFormToRow(values, existingRow = null) {
    return {
        id: existingRow?.id ?? Date.now(),
        course: values.courseName,
        courseCode: values.courseCode,
        department: values.department,
        description: values.description,
    };
}

function mapStrandFormToRow(values, existingRow = null) {
    return {
        id: existingRow?.id ?? Date.now(),
        strand: values.strandName,
        strandCode: values.strandCode,
        relatedCourse: values.relatedCourse,
        briefSummary: values.briefSummary,
    };
}

export default function AccountCreation() {
    const [schools, setSchools] = useState(SCHOOLS_DATA);
    const [courses, setCourses] = useState(COURSES_DATA);
    const [strands, setStrands] = useState(STRANDS_DATA);

    const [activeEntity, setActiveEntity] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [wasEditSubmit, setWasEditSubmit] = useState(false);
    const [wasDeleteSubmit, setWasDeleteSubmit] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [pendingDelete, setPendingDelete] = useState(null);

    const courseTrackOptions = useMemo(() => getCourseTrackOptions(courses), [courses]);

    const openAddModal = useCallback((entity) => {
        setActiveEntity(entity);
        setEditingItem(null);
        setModalOpen(true);
    }, []);

    const openEditModal = useCallback((entity, row) => {
        setActiveEntity(entity);
        setEditingItem(row);
        setModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setModalOpen(false);
        setEditingItem(null);
        setActiveEntity(null);
    }, []);

    const closeSuccess = useCallback(() => {
        setSuccessOpen(false);
        setWasEditSubmit(false);
        setWasDeleteSubmit(false);
    }, []);

    const requestDelete = useCallback((entity, row) => {
        setPendingDelete({ entity, id: row.id });
        setDeleteOpen(true);
    }, []);

    const cancelDelete = useCallback(() => {
        setDeleteOpen(false);
        setPendingDelete(null);
    }, []);

    const confirmDelete = useCallback(() => {
        if (!pendingDelete) return;

        const { entity, id } = pendingDelete;
        if (entity === 'school') {
            setSchools((prev) => prev.filter((item) => item.id !== id));
        } else if (entity === 'course') {
            setCourses((prev) => prev.filter((item) => item.id !== id));
        } else if (entity === 'strand') {
            setStrands((prev) => prev.filter((item) => item.id !== id));
        }

        setDeleteOpen(false);
        setPendingDelete(null);
        setWasEditSubmit(false);
        setWasDeleteSubmit(true);
        setSuccessOpen(true);
    }, [pendingDelete]);

    const handleSchoolSubmit = useCallback(
        (values) => {
            const row = mapSchoolFormToRow(values, editingItem);
            if (editingItem) {
                setSchools((prev) =>
                    prev.map((item) => (item.id === editingItem.id ? row : item)),
                );
            } else {
                setSchools((prev) => [...prev, row]);
            }
            setWasEditSubmit(editingItem != null);
            setWasDeleteSubmit(false);
            setModalOpen(false);
            setEditingItem(null);
            setActiveEntity(null);
            setSuccessOpen(true);
        },
        [editingItem],
    );

    const handleCourseSubmit = useCallback(
        (values) => {
            const row = mapCourseFormToRow(values, editingItem);
            if (editingItem) {
                setCourses((prev) =>
                    prev.map((item) => (item.id === editingItem.id ? row : item)),
                );
            } else {
                setCourses((prev) => [...prev, row]);
            }
            setWasEditSubmit(editingItem != null);
            setWasDeleteSubmit(false);
            setModalOpen(false);
            setEditingItem(null);
            setActiveEntity(null);
            setSuccessOpen(true);
        },
        [editingItem],
    );

    const handleStrandSubmit = useCallback(
        (values) => {
            const row = mapStrandFormToRow(values, editingItem);
            if (editingItem) {
                setStrands((prev) =>
                    prev.map((item) => (item.id === editingItem.id ? row : item)),
                );
            } else {
                setStrands((prev) => [...prev, row]);
            }
            setWasEditSubmit(editingItem != null);
            setWasDeleteSubmit(false);
            setModalOpen(false);
            setEditingItem(null);
            setActiveEntity(null);
            setSuccessOpen(true);
        },
        [editingItem],
    );

    const successMessage = wasDeleteSubmit
        ? 'Data has been deleted!'
        : wasEditSubmit
          ? 'Update Successful!'
          : 'Successfully Added!';

    return (
        <AdminLayout activeNavId="account-creation">
            <Head title="Account Creation" />
            <h1 className="mb-6 text-2xl font-bold text-white sm:mb-8 sm:text-3xl">
                Account Creation
            </h1>

            <AdminTable
                title="Schools"
                columns={SCHOOL_COLUMNS}
                data={schools}
                entityName="School"
                onAdd={() => openAddModal('school')}
                onEdit={(row) => openEditModal('school', row)}
                onDelete={(row) => requestDelete('school', row)}
            />
            <AdminTable
                title="Courses"
                columns={COURSE_COLUMNS}
                data={courses}
                entityName="Course"
                onAdd={() => openAddModal('course')}
                onEdit={(row) => openEditModal('course', row)}
                onDelete={(row) => requestDelete('course', row)}
            />
            <AdminTable
                title="Strands"
                columns={STRAND_COLUMNS}
                data={strands}
                entityName="Strand"
                onAdd={() => openAddModal('strand')}
                onEdit={(row) => openEditModal('strand', row)}
                onDelete={(row) => requestDelete('strand', row)}
            />

            <SchoolModal
                isOpen={modalOpen && activeEntity === 'school'}
                onClose={closeModal}
                initialData={editingItem}
                onSubmit={handleSchoolSubmit}
            />

            <CourseModal
                isOpen={modalOpen && activeEntity === 'course'}
                onClose={closeModal}
                initialData={editingItem}
                onSubmit={handleCourseSubmit}
            />

            <StrandModal
                isOpen={modalOpen && activeEntity === 'strand'}
                onClose={closeModal}
                initialData={editingItem}
                courseOptions={courseTrackOptions}
                onSubmit={handleStrandSubmit}
            />

            <DeleteConfirmationModal
                isOpen={deleteOpen}
                onCancel={cancelDelete}
                onConfirm={confirmDelete}
            />

            <SuccessModal
                isOpen={successOpen}
                onClose={closeSuccess}
                message={successMessage}
            />
        </AdminLayout>
    );
}
