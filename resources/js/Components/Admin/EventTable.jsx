import AdminPagination from "@/Components/Admin/AdminPagination";
import EventDesktopTable from "@/Components/Admin/EventDesktopTable";
import EventMobileList from "@/Components/Admin/EventMobileList";

export default function EventTable({
    events = [],
    showDates = true,
    showActions = true,
    currentPage = 1,
    pageCount = 1,
    onPageChange = () => {},
    onEdit = () => {},
    onDelete = () => {},
    copiedCode = null,
    onCopy = () => {},
    emptyMessage = "No events found.",
}) {
    return (
        <div className="w-full min-w-0">
            <div className="hidden md:block">
                <EventDesktopTable
                    events={events}
                    showDates={showDates}
                    showActions={showActions}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    copiedCode={copiedCode}
                    onCopy={onCopy}
                    emptyMessage={emptyMessage}
                />
            </div>

            <div className="md:hidden">
                <EventMobileList
                    events={events}
                    showDates={showDates}
                    showActions={showActions}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    copiedCode={copiedCode}
                    onCopy={onCopy}
                    emptyMessage={emptyMessage}
                />
            </div>

            <div className="mt-5 max-w-full overflow-x-auto border-t border-white/10 pt-4">
                <AdminPagination
                    currentPage={currentPage}
                    pageCount={pageCount}
                    onChange={onPageChange}
                />
            </div>
        </div>
    );
}
