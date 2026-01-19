using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Erp.Api.Migrations
{
    /// <inheritdoc />
    public partial class RecreateCompanyTab : Migration
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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "company_tab");
        }
    }
}