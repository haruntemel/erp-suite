using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Erp.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddInventoryPartTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
           

            migrationBuilder.CreateTable(
                name: "inventory_part",
                columns: table => new
                {
                    contract = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    part_no = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    accounting_group = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    country_of_origin = table.Column<string>(type: "character varying(12)", maxLength: 12, nullable: true),
                    estimated_material_cost = table.Column<decimal>(type: "numeric(22,2)", nullable: true),
                    part_product_code = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    part_product_family = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    part_status = table.Column<string>(type: "character varying(4)", maxLength: 4, nullable: true),
                    planner_buyer = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: true),
                    prime_commodity = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    second_commodity = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    unit_meas = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: true),
                    sales_unit_meas = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: true),
                    description = table.Column<string>(type: "character varying(800)", maxLength: 800, nullable: true),
                    list_price = table.Column<decimal>(type: "numeric(22,2)", nullable: true),
                    list_price_incl_tax = table.Column<decimal>(type: "numeric(22,2)", nullable: true),
                    price_conv_factor = table.Column<decimal>(type: "numeric(22,2)", nullable: true),
                    tax_code = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: true),
                    tax_class_id = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: true),
                    sales_type = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    sales_type_db = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: true),
                    storage_width_requirement = table.Column<decimal>(type: "numeric(22,2)", nullable: true),
                    storage_height_requirement = table.Column<decimal>(type: "numeric(22,2)", nullable: true),
                    storage_depth_requirement = table.Column<decimal>(type: "numeric(22,2)", nullable: true),
                    storage_volume_requirement = table.Column<decimal>(type: "numeric(22,2)", nullable: true),
                    storage_weight_requirement = table.Column<decimal>(type: "numeric(22,2)", nullable: true),
                    min_storage_temperature = table.Column<decimal>(type: "numeric(22,2)", nullable: true),
                    max_storage_temperature = table.Column<decimal>(type: "numeric(22,2)", nullable: true),
                    min_storage_humidity = table.Column<decimal>(type: "numeric(22,2)", nullable: true),
                    max_storage_humidity = table.Column<decimal>(type: "numeric(22,2)", nullable: true),
                    standard_putaway_qty = table.Column<decimal>(type: "numeric(22,2)", nullable: true),
                    standard_pack_size = table.Column<decimal>(type: "numeric(22,2)", nullable: true),
                    create_date = table.Column<DateTime>(type: "date", nullable: true),
                    expected_leadtime = table.Column<decimal>(type: "numeric(22,0)", nullable: true),
                    rowversion = table.Column<decimal>(type: "numeric(22,0)", nullable: false, defaultValue: 1m),
                    rowkey = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_inventory_part", x => new { x.contract, x.part_no });
                });

            
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
           

            migrationBuilder.DropTable(
                name: "inventory_part");

          
        }
    }
}
