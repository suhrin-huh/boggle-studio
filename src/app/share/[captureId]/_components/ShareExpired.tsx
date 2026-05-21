import Link from 'next/link';
import NeumorphicButton from '@/components/common/NeumorphicButton';
import PageTitle from '@/components/common/PageTitle';

/**저장 만료 등의 이유로 데이터 조회에 실패한 경우 보여지는 UI */
export default function ShareExpired() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <PageTitle title="Not Found" />
      <NeumorphicButton>
        <Link href="/" className="tracking-widest">
          Go to Home
        </Link>
      </NeumorphicButton>
    </div>
  );
}
