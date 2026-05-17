import PageTitle from '@/components/common/PageTitle';
import ResultActionButtons from './ResultActionButtons';

interface ResultViewProps {
  resultImage: string;
  fileName: string;
}

export default function ResultView({ resultImage, fileName }: ResultViewProps) {
  return (
    <>
      <PageTitle title="Done!" />
      <img src={resultImage} alt="Generated cut" className="h-90 w-auto" />
      <ResultActionButtons resultImage={resultImage} fileName={fileName} />
    </>
  );
}
