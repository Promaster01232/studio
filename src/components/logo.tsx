import Image from 'next/image';

export function Logo() {
  return (
    <div className="flex items-center">
      <Image src="https://storage.googleapis.com/project-os-screenshot/1770932454559/image.png" alt="Nyaya Sahayak Logo" width={596} height={524} className="h-10 w-auto" />
    </div>
  );
}
