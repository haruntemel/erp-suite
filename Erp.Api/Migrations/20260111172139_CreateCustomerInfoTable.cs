using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Erp.Api.Migrations
{
    /// <inheritdoc />
    public partial class CreateCustomerInfoTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "company_tab",
                columns: table => new
                {
                    company = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    name = table.Column<string>(type: "character varying(400)", maxLength: 400, nullable: false),
                    creation_date = table.Column<DateOnly>(type: "date", nullable: false),
                    association_no = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    default_language = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                    logotype = table.Column<string>(type: "character varying(400)", maxLength: 400, nullable: true),
                    corporate_form = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    country = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                    created_by = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    localization_country = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    rowversion = table.Column<decimal>(type: "numeric(22,0)", nullable: false),
                    rowkey = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_company_tab", x => x.company);
                });

            migrationBuilder.CreateTable(
                name: "customer_info",
                columns: table => new
                {
                    customer_id = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    name = table.Column<string>(type: "character varying(400)", maxLength: 400, nullable: false),
                    association_no = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    corporate_form = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    country = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false, defaultValue: "TR"),
                    party_type = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: true),
                    category = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: true),
                    check_limit = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    limit_control_type = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: true),
                    default_language = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false, defaultValue: "tr"),
                    created_by = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    changed_by = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: true),
                    creation_date = table.Column<DateTime>(type: "date", nullable: false),
                    identifier_reference = table.Column<string>(type: "character varying(400)", maxLength: 400, nullable: true),
                    rowversion = table.Column<decimal>(type: "numeric(22,0)", nullable: false, defaultValue: 1m),
                    rowkey = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    rowtype = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_customer_info", x => x.customer_id);
                });

            migrationBuilder.CreateTable(
                name: "permissions",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    module = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    page = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    action = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_permissions", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "products",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Price = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    StockQty = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_products", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "role_permissions",
                columns: table => new
                {
                    role_id = table.Column<int>(type: "integer", nullable: false),
                    permission_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_role_permissions", x => new { x.role_id, x.permission_id });
                });

            migrationBuilder.CreateTable(
                name: "roles",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roles", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    username = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    password_hash = table.Column<string>(type: "text", nullable: false),
                    role_id = table.Column<int>(type: "integer", nullable: true),
                    status = table.Column<bool>(type: "boolean", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.id);
                    table.ForeignKey(
                        name: "FK_users_roles_role_id",
                        column: x => x.role_id,
                        principalTable: "roles",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_products_Code",
                table: "products",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_role_id",
                table: "users",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "IX_users_username",
                table: "users",
                column: "username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "company_tab");

            migrationBuilder.DropTable(
                name: "customer_info");

            migrationBuilder.DropTable(
                name: "permissions");

            migrationBuilder.DropTable(
                name: "products");

            migrationBuilder.DropTable(
                name: "role_permissions");

            migrationBuilder.DropTable(
                name: "users");

            migrationBuilder.DropTable(
                name: "roles");
        }
    }
}
