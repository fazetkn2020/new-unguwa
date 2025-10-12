export default function ELibraryDashboard() {
  const ebooks = [
    { title: "Mathematics Notes", url: "/assets/math.pdf" },
    { title: "English Grammar", url: "/assets/english.pdf" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">E-Library</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {ebooks.map((ebook, idx) => (
          <div key={idx} className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold">{ebook.title}</h3>
            <a
              href={ebook.url}
              download
              className="mt-2 inline-block bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
