import { ContainerScroll } from '../components/ui/container-scroll-animation';
import { motion } from 'framer-motion';

export default function ScrollDemo() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="flex flex-col overflow-hidden">
        <ContainerScroll
          titleComponent={
            <>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-semibold text-white"
              >
                اكتشف قوة
                <br />
                <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
                  التمرير المتحرك
                </span>
              </motion.h1>
            </>
          }
        >
          <img
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1400&h=720&fit=crop"
            alt="hero"
            height={720}
            width={1400}
            className="mx-auto rounded-2xl object-cover h-full object-left-top"
            draggable={false}
          />
        </ContainerScroll>
      </div>

      <div className="page-container mt-16">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold text-white">محتوى إضافي بعد الأنيميشن</h2>
          <p className="text-gray-400">هذا المحتوى يظهر بعد الانتهاء من تمرير الصورة</p>
        </div>
      </div>
    </div>
  );
}
