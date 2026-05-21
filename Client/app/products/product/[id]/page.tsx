import Link from "next/link";

interface Variant {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  percentage: number;
}

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  variants: Variant[];
}

// Fetch products directly from your Spring Boot backend on the server
async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch("https://ar-app-back-end.onrender.com/api/products/product/", {
      cache: "no-store", // Ensures fresh data on every load
    });

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    return res.json();
  } catch (error) {
    console.error("Backend fetch error:", error);
    return []; // Return empty array as fallback if backend is down
  }
}

export default async function ProductsFrontPage() {
  const products = await getProducts();

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Product Catalog</h1>
          <p style={styles.subtitle}>Manage your smart retail inventory, variants, and stock tiers.</p>
        </div>
      </header>

      {products.length === 0 ? (
        <div style={styles.emptyState}>
          <h3>No Products Found</h3>
          <p>Make sure your Spring Boot server is running on port 8080 and your database contains records.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {products.map((product) => (
            <div key={product.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.categoryBadge}>{product.category}</span>
                <span style={styles.priceTag}>${product.price}</span>
              </div>
              
              <h2 style={styles.productName}>{product.name}</h2>
              <p style={styles.description}>{product.description || "No description provided."}</p>
              
              <div style={styles.metaRow}>
                <span><strong>Total Stock:</strong> {product.quantity} units</span>
              </div>

              {product.variants && product.variants.length > 0 && (
                <div style={styles.variantSection}>
                  <span style={styles.variantTitle}>Available Variants:</span>
                  <div style={styles.variantChips}>
                    {product.variants.map((v) => (
                      <span key={v.id} style={styles.chip} title={`SKU: ${v.sku}`}>
                        {v.name} ({v.quantity})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Linking to your dynamic page route */}
              <Link href={`/products/${product.id}`} style={styles.viewButton}>
                View Detailed Page
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Inline styling mapping for rapid development/testing without breaking Tailwind or CSS setups
const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "40px max(5%, 20px)",
    maxWidth: "1400px",
    margin: "0 auto",
    fontFamily: "system-ui, sans-serif",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
  },
  header: {
    marginBottom: "40px",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "20px",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#4b5563",
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "30px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  categoryBadge: {
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
    padding: "4px 12px",
    borderRadius: "9999px",
    fontSize: "0.85rem",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  priceTag: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#059669",
  },
  productName: {
    fontSize: "1.4rem",
    fontWeight: "600",
    color: "#1f2937",
    margin: "0 0 10px 0",
  },
  description: {
    fontSize: "0.95rem",
    color: "#6b7280",
    lineHeight: "1.5",
    margin: "0 0 16px 0",
    flexGrow: 1,
  },
  metaRow: {
    fontSize: "0.9rem",
    color: "#374151",
    marginBottom: "12px",
  },
  variantSection: {
    borderTop: "1px dashed #e5e7eb",
    paddingTop: "12px",
    marginBottom: "20px",
  },
  variantTitle: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#4b5563",
    display: "block",
    marginBottom: "8px",
  },
  variantChips: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
  },
  chip: {
    backgroundColor: "#f3f4f6",
    color: "#1f2937",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "0.8rem",
    border: "1px solid #e5e7eb",
  },
  viewButton: {
    display: "block",
    textAlign: "center",
    backgroundColor: "#111827",
    color: "#ffffff",
    padding: "12px",
    borderRadius: "8px",
    fontWeight: "500",
    textDecoration: "none",
    transition: "background-color 0.2s",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px dashed #ch3d4",
    color: "#4b5563",
  },
};



