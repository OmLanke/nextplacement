export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main branding */}
          <p className="text-gray-600 text-sm font-medium mb-2">
            Developed and maintained by SwDC KJSSE
          </p>
          
          {/* Developer names */}
          <div className="flex flex-wrap justify-center items-center gap-2 text-xs text-gray-500">
            <span>Om Dwivedi</span>
            <span className="text-gray-300">•</span>
            <span>Anushrut Pandit</span>
            <span className="text-gray-300">•</span>
            <span>Om Lanke</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
