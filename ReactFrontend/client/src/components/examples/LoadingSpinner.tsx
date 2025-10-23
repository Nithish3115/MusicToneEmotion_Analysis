import LoadingSpinner from '../LoadingSpinner';

export default function LoadingSpinnerExample() {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Small</h3>
        <LoadingSpinner size="sm" />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Medium with text</h3>
        <LoadingSpinner size="md" text="Analyzing audio..." />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Large</h3>
        <LoadingSpinner size="lg" text="Processing..." />
      </div>
    </div>
  );
}
