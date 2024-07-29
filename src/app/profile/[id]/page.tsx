export default function page({ params }: { params: { id: string } }) {
  return (
    <section className="flex flex-col items-center justify-between min-h-screen py-2">
      <h1 className="bg-orange-500  p-2 rounded shadow mt-10 text-center font-semibold text-3xl">
        {params.id}
      </h1>
    </section>
  );
}
