'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  {
    name: 'Agaves',
    slug: 'agaves',
    description: 'Agaves spectaculaires pour jardins modernes',
    icon: '🌿',
    count: 22
  },
  {
    name: 'Aloès', 
    slug: 'aloes',
    description: 'Aloès thérapeutiques et décoratifs',
    icon: '🌱',
    count: 8
  },
  {
    name: 'Boutures',
    slug: 'boutures', 
    description: 'Boutures et jeunes plants',
    icon: '🌿',
    count: 6
  },
  {
    name: 'Cactus',
    slug: 'cactus',
    description: 'Collection exclusive de cactus majestueux', 
    icon: '🌵',
    count: 33
  },
  {
    name: 'Yuccas',
    slug: 'yuccas',
    description: 'Yuccas résistants et décoratifs',
    icon: '🌴', 
    count: 12
  },
  {
    name: 'Sujets Exceptionnels',
    slug: 'sujets-exceptionnels',
    description: 'Spécimens rares et collectionneurs',
    icon: '⭐',
    count: 19
  }
];

export default function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl z-50"
        style={{ 
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100vw',
          maxWidth: '1200px'
        }}
      >
        <div className="px-8 py-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Nos Collections
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Découvrez notre sélection de plantes architecturales exceptionnelles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categorie/${category.slug}`}
                onClick={onClose}
                className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {category.name}
                      </h3>
                      <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 px-2 py-1 rounded-full font-medium">
                        {category.count}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-green-600 text-xl">🚚</span>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-200 text-sm">
                    Livraison 24H
                  </h4>
                  <p className="text-green-600 dark:text-green-300 text-xs">
                    Expédition rapide par transporteur spécialisé
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-blue-600 text-xl">👨‍🌾</span>
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 text-sm">
                    Conseils d'experts
                  </h4>
                  <p className="text-blue-600 dark:text-blue-300 text-xs">
                    15+ années d'expérience à votre service
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link
              href="/qui-suis-je"
              onClick={onClose}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              <span>📞</span>
              Nous contacter
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 