import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions Légales - Cactus Aty',
  description: 'Mentions légales et informations légales de Cactus Aty, spécialiste des cactus et plantes succulentes.',
};

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[var(--accent)]/5 to-[var(--primary)]/10">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-[var(--primary)] mb-8 text-center">
            Mentions Légales
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-8">
            
            <section>
              <h2 className="text-2xl font-semibold text-[var(--primary)] border-b-2 border-[var(--accent)] pb-2 mb-4">
                1. Informations légales
              </h2>
              <div className="bg-[var(--accent)]/10 p-6 rounded-lg">
                <p><strong>Nom de l'entreprise :</strong> Cactus Aty</p>
                <p><strong>Forme juridique :</strong> [À compléter]</p>
                <p><strong>Adresse du siège social :</strong> [À compléter]</p>
                <p><strong>Téléphone :</strong> [À compléter]</p>
                <p><strong>Email :</strong> contact@cactus-aty.fr</p>
                <p><strong>SIRET :</strong> [À compléter]</p>
                <p><strong>RCS :</strong> [À compléter]</p>
                <p><strong>TVA Intracommunautaire :</strong> [À compléter]</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[var(--primary)] border-b-2 border-[var(--accent)] pb-2 mb-4">
                2. Directeur de la publication
              </h2>
              <p>Le directeur de la publication du site www.cactus-aty.fr est [Nom du responsable].</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[var(--primary)] border-b-2 border-[var(--accent)] pb-2 mb-4">
                3. Hébergement
              </h2>
              <div className="bg-[var(--primary)]/5 p-6 rounded-lg">
                <p><strong>Hébergeur :</strong> Vercel Inc.</p>
                <p><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
                <p><strong>Site web :</strong> <a href="https://vercel.com" className="text-[var(--primary)] hover:underline">vercel.com</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[var(--primary)] border-b-2 border-[var(--accent)] pb-2 mb-4">
                4. Propriété intellectuelle
              </h2>
              <p>
                L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur 
                et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les 
                documents téléchargeables et les représentations iconographiques et photographiques.
              </p>
              <p>
                La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est 
                formellement interdite sauf autorisation expresse du directeur de la publication.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[var(--primary)] border-b-2 border-[var(--accent)] pb-2 mb-4">
                5. Protection des données personnelles
              </h2>
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi "Informatique et Libertés", 
                vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles 
                vous concernant.
              </p>
              <p>
                Pour exercer ces droits, vous pouvez nous contacter à l'adresse : contact@cactus-aty.fr
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[var(--primary)] border-b-2 border-[var(--accent)] pb-2 mb-4">
                6. Cookies
              </h2>
              <p>
                Ce site utilise des cookies pour améliorer l'expérience utilisateur et analyser le trafic. 
                En continuant à naviguer sur ce site, vous acceptez l'utilisation de cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[var(--primary)] border-b-2 border-[var(--accent)] pb-2 mb-4">
                7. Responsabilité
              </h2>
              <p>
                Les informations contenues sur ce site sont aussi précises que possible et le site remis à jour 
                à différentes périodes de l'année, mais peut toutefois contenir des inexactitudes ou des omissions.
              </p>
              <p>
                Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, merci de bien 
                vouloir le signaler par email, à l'adresse contact@cactus-aty.fr, en décrivant le problème de 
                la façon la plus précise possible.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[var(--primary)] border-b-2 border-[var(--accent)] pb-2 mb-4">
                8. Droit applicable et attribution de juridiction
              </h2>
              <p>
                Tout litige en relation avec l'utilisation du site www.cactus-aty.fr est soumis au droit français. 
                Il est fait attribution exclusive de juridiction aux tribunaux compétents de [Ville].
              </p>
            </section>

          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-600">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 