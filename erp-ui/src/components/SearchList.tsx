import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface SearchListItem {
  id: string | number;
  code: string;
  name: string;
  description?: string;
  [key: string]: any;
}

interface SearchListProps {
  title: string;
  items: SearchListItem[];
  onSelect: (item: SearchListItem) => void;
  onToggle?: () => void;
  searchFields?: string[];
  displayFields?: string[];
  icon?: string;
}

export default function SearchList({
  title,
  items,
  onSelect,
  onToggle,
  searchFields = ["code", "name", "description"],
  displayFields = ["code", "name"],
  icon = "fas fa-list"
}: SearchListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<SearchListItem[]>(items);

  // Arama yap
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(items);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = items.filter(item => {
      return searchFields.some(field => {
        const value = item[field];
        return value && value.toString().toLowerCase().includes(query);
      });
    });

    setFilteredItems(filtered);
  }, [searchQuery, items, searchFields]);

  const handleItemClick = (item: SearchListItem) => {
    onSelect(item);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div 
      className="search-list-panel"
      style={{
        width: "320px",
        height: "calc(100vh - 70px)",
        position: "fixed",
        left: "280px",
        top: "70px",
        backgroundColor: "#1e293b",
        borderRight: "1px solid #334155",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      {/* Panel Header */}
      <div 
        className="panel-header"
        style={{
          padding: "15px",
          borderBottom: "1px solid #334155",
          backgroundColor: "#0f172a",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: "60px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <i className={icon} style={{ color: "#38bdf8", fontSize: "1.2rem" }}></i>
          <h3 style={{ color: "#f1f5f9", fontSize: "1rem", fontWeight: "600" }}>
            {title}
          </h3>
        </div>
        <button
          onClick={onToggle}
          style={{
            background: "none",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
            padding: "5px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            gap: "5px"
          }}
        >
          <ChevronLeftIcon style={{ width: "20px", height: "20px" }} />
          <span style={{ fontSize: "0.8rem" }}>Gizle</span>
        </button>
      </div>

      {/* Search Box */}
      <div style={{ padding: "15px", borderBottom: "1px solid #334155" }}>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            style={{
              width: "100%",
              padding: "10px 35px 10px 35px",
              backgroundColor: "rgba(30, 41, 59, 0.8)",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#f1f5f9",
              fontSize: "0.9rem"
            }}
          />
          <div style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#94a3b8"
          }}>
            <MagnifyingGlassIcon style={{ width: "16px", height: "16px" }} />
          </div>
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                padding: "0"
              }}
            >
              ✕
            </button>
          )}
        </div>
        <div style={{ 
          fontSize: "0.8rem", 
          color: "#64748b", 
          marginTop: "5px",
          display: "flex",
          justifyContent: "space-between"
        }}>
          <span>{filteredItems.length} item(s) found</span>
          {searchQuery && (
            <span>Search: "{searchQuery}"</span>
          )}
        </div>
      </div>

      {/* Items List */}
      <div style={{ 
        flex: 1, 
        overflowY: "auto",
        padding: "10px"
      }}>
        {filteredItems.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                style={{
                  padding: "12px 10px",
                  backgroundColor: "rgba(30, 41, 59, 0.5)",
                  border: "1px solid #334155",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  marginBottom: "5px"
                }}
                className="search-list-item"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(56, 189, 248, 0.1)";
                  e.currentTarget.style.borderColor = "#38bdf8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(30, 41, 59, 0.5)";
                  e.currentTarget.style.borderColor = "#334155";
                }}
              >
                {displayFields.map((field, index) => (
                  <div key={field} style={{ 
                    display: "flex", 
                    alignItems: "center",
                    marginBottom: index < displayFields.length - 1 ? "3px" : "0"
                  }}>
                    <span style={{ 
                      fontSize: "0.75rem", 
                      color: "#94a3b8",
                      minWidth: "80px"
                    }}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}:
                    </span>
                    <span style={{ 
                      fontSize: "0.9rem", 
                      color: "#f1f5f9",
                      fontWeight: field === "code" ? "600" : "400",
                      marginLeft: "10px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}>
                      {item[field] || "-"}
                    </span>
                  </div>
                ))}
                {item.description && (
                  <div style={{ 
                    fontSize: "0.8rem", 
                    color: "#64748b", 
                    marginTop: "5px",
                    fontStyle: "italic"
                  }}>
                    {item.description.length > 60 
                      ? `${item.description.substring(0, 60)}...` 
                      : item.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: "center", 
            padding: "40px 20px",
            color: "#94a3b8"
          }}>
            {searchQuery ? (
              <>
                <i className="fas fa-search" style={{ fontSize: "2rem", marginBottom: "10px" }}></i>
                <p>No results found for "{searchQuery}"</p>
                <button
                  onClick={handleClearSearch}
                  style={{
                    marginTop: "10px",
                    background: "none",
                    border: "1px solid #334155",
                    color: "#94a3b8",
                    padding: "5px 15px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Clear Search
                </button>
              </>
            ) : (
              <>
                <i className="fas fa-inbox" style={{ fontSize: "2rem", marginBottom: "10px" }}></i>
                <p>No items to display</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Panel Footer */}
      <div style={{ 
        padding: "10px 15px", 
        borderTop: "1px solid #334155",
        backgroundColor: "#0f172a",
        fontSize: "0.75rem",
        color: "#64748b",
        display: "flex",
        justifyContent: "space-between"
      }}>
        <span>SearchList v1.0</span>
        <span>{items.length} total items</span>
      </div>
    </div>
  );
}