import AdminFieldLabel from '@/Components/Admin/AdminFieldLabel';
import ContentCard from '@/Components/Admin/ContentCard';
import ImageDropzone from '@/Components/Admin/ImageDropzone';
import SectionCard from '@/Components/Admin/SectionCard';
import {
    ADMIN_GOLD_BUTTON_CLASS,
    ADMIN_INPUT_CLASS,
    ADMIN_SELECT_CLASS,
} from '@/Components/Admin/adminFormStyles';
import { CAROUSEL_ITEMS, CAROUSEL_LABEL_OPTIONS } from '@/data/adminHomeData';
import { Plus } from 'lucide-react';

export default function CarouselSection() {
    return (
        <SectionCard title="Carousel">
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div>
                        <AdminFieldLabel htmlFor="carousel-label" required>
                            Label
                        </AdminFieldLabel>
                        <select id="carousel-label" className={ADMIN_SELECT_CLASS} defaultValue="">
                            <option value="" disabled>
                                Select label
                            </option>
                            {CAROUSEL_LABEL_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <AdminFieldLabel htmlFor="carousel-title" required>
                            Title
                        </AdminFieldLabel>
                        <input
                            id="carousel-title"
                            type="text"
                            placeholder="e.g. MSL Network Awards"
                            className={ADMIN_INPUT_CLASS}
                        />
                    </div>
                    <div>
                        <AdminFieldLabel htmlFor="carousel-description" required>
                            Description
                        </AdminFieldLabel>
                        <input
                            id="carousel-description"
                            type="text"
                            placeholder="Short description"
                            className={ADMIN_INPUT_CLASS}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div>
                        <AdminFieldLabel htmlFor="carousel-link" required>
                            Link
                        </AdminFieldLabel>
                        <input
                            id="carousel-link"
                            type="url"
                            placeholder="https://example.com"
                            className={ADMIN_INPUT_CLASS}
                        />
                    </div>
                    <div>
                        <AdminFieldLabel htmlFor="carousel-start" required>
                            Start Date
                        </AdminFieldLabel>
                        <input id="carousel-start" type="date" className={ADMIN_INPUT_CLASS} />
                    </div>
                    <div>
                        <AdminFieldLabel htmlFor="carousel-end" required>
                            End Date
                        </AdminFieldLabel>
                        <input id="carousel-end" type="date" className={ADMIN_INPUT_CLASS} />
                    </div>
                </div>

                <ImageDropzone hint="PNG, JPG, JPEG (Max. 5MB). Must be 1920x1080 pixels." />

                <div className="flex justify-end">
                    <button type="button" className={ADMIN_GOLD_BUTTON_CLASS}>
                        <Plus className="h-4 w-4" />
                        Add New Carousel
                    </button>
                </div>

                <div className="border-t border-neutral-800 pt-8">
                    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="text-sm font-semibold text-white">Current Carousel Images</h3>
                        <p className="text-xs text-gray-500">Drag the grip lines to reorder</p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {CAROUSEL_ITEMS.map((item) => (
                            <ContentCard
                                key={item.id}
                                imageSrc={item.image}
                                imageAlt={item.title}
                            >
                                <p className="font-semibold text-white">{item.title}</p>
                                <p className="mt-1 text-xs text-gray-500">{item.meta}</p>
                            </ContentCard>
                        ))}
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}
