export default function MentionsLegales() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mentions Légales</h1>
      <div className="prose max-w-none">
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">1. Informations légales</h2>
          <p>Ce site est édité par : [Votre nom ou nom de société]</p>
          <p>Adresse : [Votre adresse]</p>
          <p>Email : [Votre email]</p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">2. Hébergement</h2>
          <p>Ce site est hébergé par : [Nom de votre hébergeur]</p>
        </section>
        {/* Ajoutez d'autres sections selon vos besoins */}
      </div>
    </div>
  );
} 