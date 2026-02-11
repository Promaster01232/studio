import Image from 'next/image';

export function Logo() {
  return (
    <div className="flex items-center">
      <Image src="https://storage.googleapis.com/project-os-screenshot/1770932454559/image.png" alt="Nyaya Sahayak Logo" width={596} height={524} className="h-12 w-auto dark:drop-shadow-[0_0_3px_rgba(255,255,255,0.3)]" />
    </div>
  );
}
