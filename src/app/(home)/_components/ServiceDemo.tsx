import Image from 'next/image';
import serviceDemo from '@/assets/image/service-demo.gif';
import PhotoFrame from './PhotoFrame';

export default function ServiceDemo() {
  return (
    <PhotoFrame className="aspect-3/4 w-60 md:w-70 lg:w-90">
      <Image
        src={serviceDemo}
        alt="서비스 소개 GIF"
        fill
        loading="eager"
        className="rounded-sm"
        unoptimized
      />
    </PhotoFrame>
  );
}
