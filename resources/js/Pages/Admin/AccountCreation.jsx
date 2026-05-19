import AdminFormModal from '@/Components/Admin/AdminFormModal';
import AdminSuccessModal from '@/Components/Admin/AdminSuccessModal';
import AdminTable from '@/Components/Admin/AdminTable';
import {
    COURSE_COLUMNS,
    COURSES_DATA,
    SCHOOL_COLUMNS,
    SCHOOLS_DATA,
    STRAND_COLUMNS,
    STRANDS_DATA,
} from '@/data/adminAccountData';
import {
    FORM_MODAL_CONFIG,
    SUCCESS_MESSAGES,
    isFormModal,
    isSuccessModal,
} from '@/data/adminModalConfig';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useCallback, useState } from 'react';

export default function AccountCreation() {
    const [modalType, setModalType] = useState(null);
    const [editingRow, setEditingRow] = useState(null);

    const closeModal = useCallback(() => {
        setModalType(null);
        setEditingRow(null);
    }, []);

    const openModal = useCallback((type, row = null) => {
        setEditingRow(row);
        setModalType(type);
    }, []);

    const handleFormSubmit = useCallback(() => {
        if (!modalType || !isFormModal(modalType)) return;
        setEditingRow(null);
        setModalType(FORM_MODAL_CONFIG[modalType].successType);
    }, [modalType]);

    const formConfig = isFormModal(modalType) ? FORM_MODAL_CONFIG[modalType] : null;
    const successMessage = isSuccessModal(modalType) ? SUCCESS_MESSAGES[modalType] : '';

    return (
        <AdminLayout activeNavId="account-creation">
            <Head title="Account Creation" />
            <h1 className="mb-8 text-3xl font-bold text-white">Account Creation</h1>

            <AdminTable
                title="Schools"
                columns={SCHOOL_COLUMNS}
                data={SCHOOLS_DATA}
                entityName="School"
                onAdd={() => openModal('add-school')}
                onEdit={(row) => openModal('edit-school', row)}
            />
            <AdminTable
                title="Courses"
                columns={COURSE_COLUMNS}
                data={COURSES_DATA}
                entityName="Course"
                onAdd={() => openModal('add-course')}
                onEdit={(row) => openModal('edit-course', row)}
            />
            <AdminTable
                title="Strands"
                columns={STRAND_COLUMNS}
                data={STRANDS_DATA}
                entityName="Strand"
                onAdd={() => openModal('add-strand')}
                onEdit={(row) => openModal('edit-strand', row)}
            />

            {formConfig && (
                <AdminFormModal
                    key={modalType}
                    isOpen
                    onClose={closeModal}
                    title={formConfig.title}
                    fields={formConfig.fields}
                    initialValues={editingRow ?? {}}
                    submitLabel={formConfig.submitLabel}
                    onSubmit={handleFormSubmit}
                />
            )}

            {isSuccessModal(modalType) && (
                <AdminSuccessModal
                    isOpen
                    onClose={closeModal}
                    message={successMessage}
                />
            )}
        </AdminLayout>
    );
}
