import { sql } from '@vercel/postgres';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  created_at: Date;
}

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  created_at: Date;
  tracking_number?: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

// Initialisation des tables
export async function initializeDatabase() {
  try {
    // Table users
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Table orders
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        order_number VARCHAR(50) UNIQUE NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        total DECIMAL(10,2) NOT NULL,
        tracking_number VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Table order_items
    await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        product_name VARCHAR(255) NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL
      )
    `;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Fonctions utilitaires
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    return result.rows[0] as User || null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function createUser(email: string, passwordHash: string, name: string): Promise<User | null> {
  try {
    const result = await sql`
      INSERT INTO users (email, password_hash, name)
      VALUES (${email}, ${passwordHash}, ${name})
      RETURNING *
    `;
    return result.rows[0] as User;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export async function getUserOrders(userId: number): Promise<any[]> {
  try {
    const result = await sql`
      SELECT 
        o.*,
        json_agg(
          json_build_object(
            'name', oi.product_name,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ${userId}
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;
    return result.rows;
  } catch (error) {
    console.error('Error getting user orders:', error);
    return [];
  }
}

export async function createOrder(
  userId: number,
  orderNumber: string,
  total: number,
  items: Array<{ name: string; quantity: number; price: number }>
): Promise<Order | null> {
  try {
    // Créer la commande
    const orderResult = await sql`
      INSERT INTO orders (user_id, order_number, total)
      VALUES (${userId}, ${orderNumber}, ${total})
      RETURNING *
    `;
    
    const order = orderResult.rows[0] as Order;
    
    // Ajouter les articles
    for (const item of items) {
      await sql`
        INSERT INTO order_items (order_id, product_name, quantity, price)
        VALUES (${order.id}, ${item.name}, ${item.quantity}, ${item.price})
      `;
    }
    
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
} 