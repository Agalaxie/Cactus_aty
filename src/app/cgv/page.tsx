export default function CGV() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Conditions Générales de Vente</h1>
      <div className="prose max-w-none">
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">1. Objet</h2>
          <p>Les présentes conditions régissent les ventes de cactus et plantes succulentes sur notre site.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">2. Prix</h2>
          <p>Les prix de nos produits sont indiqués en euros toutes taxes comprises (TTC).</p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">3. Commandes</h2>
          <p>Les informations contractuelles sont présentées en langue française et feront l'objet d'une confirmation au plus tard au moment de la validation de votre commande.</p>
        </section>
        {/* Ajoutez d'autres sections selon vos besoins */}
      </div>
    </div>
  );
} 