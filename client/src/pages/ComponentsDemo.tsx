import { Calendar } from '../components/ui/calendar';
import { Announcement, AnnouncementTag, AnnouncementTitle } from '../components/ui/announcement';
import { ArrowUpRightIcon } from 'lucide-react';

export default function ComponentsDemo() {
  return (
    <div className="min-h-screen pt-24 pb-16 page-container space-y-12">
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">التقويم</h2>
        <div className="max-w-md">
          <Calendar />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-6">إعلان الخطأ</h2>
        <div className="flex flex-col gap-4">
          <Announcement themed className="bg-rose-100 text-rose-700">
            <AnnouncementTag>Error</AnnouncementTag>
            <AnnouncementTitle>
              Something went wrong
              <ArrowUpRightIcon size={16} className="shrink-0 opacity-70" />
            </AnnouncementTitle>
          </Announcement>
          <Announcement themed className="bg-emerald-100 text-emerald-700">
            <AnnouncementTag>Success</AnnouncementTag>
            <AnnouncementTitle>
              تم بنجاح
              <ArrowUpRightIcon size={16} className="shrink-0 opacity-70" />
            </AnnouncementTitle>
          </Announcement>
          <Announcement themed className="bg-amber-100 text-amber-700">
            <AnnouncementTag>Warning</AnnouncementTag>
            <AnnouncementTitle>
              تحذير: هذا الإجراء لا يمكن التراجع عنه
              <ArrowUpRightIcon size={16} className="shrink-0 opacity-70" />
            </AnnouncementTitle>
          </Announcement>
        </div>
      </section>
    </div>
  );
}
