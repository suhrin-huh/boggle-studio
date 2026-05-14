import serviceDemo from '@/assets/image/service-demo.gif';
import PhotoFrame from './PhotoFrame';

export default function ServiceDemo() {
  return (
    <PhotoFrame className="aspect-3/4 w-60">
      <img
        src={serviceDemo.src}
        alt="서비스 소개 GIF"
        className="rounded-sm"
        width="240"
        height="320"
      />
    </PhotoFrame>
  );
}
