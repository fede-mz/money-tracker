# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_07_23_170458) do
  create_table "accounts", force: :cascade do |t|
    t.integer "user_id"
    t.string "title", null: false
    t.string "currency", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_accounts_on_user_id"
  end

  create_table "cash_flows", force: :cascade do |t|
    t.integer "account_id"
    t.integer "category_id"
    t.string "description"
    t.date "flow_date", null: false
    t.integer "amount_cents", default: 0, null: false
    t.string "amount_currency", default: "EUR", null: false
    t.boolean "is_balance", default: false, null: false
    t.boolean "is_annualized", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_cash_flows_on_account_id"
    t.index ["category_id"], name: "index_cash_flows_on_category_id"
    t.index ["flow_date"], name: "index_cash_flows_on_flow_date"
  end

  create_table "cash_flows_tags", id: false, force: :cascade do |t|
    t.integer "cash_flow_id", null: false
    t.integer "tag_id", null: false
    t.index ["cash_flow_id", "tag_id"], name: "index_cash_flows_tags_on_cash_flow_id_and_tag_id", unique: true
    t.index ["cash_flow_id"], name: "index_cash_flows_tags_on_cash_flow_id"
    t.index ["tag_id"], name: "index_cash_flows_tags_on_tag_id"
  end

  create_table "categories", force: :cascade do |t|
    t.integer "user_id"
    t.string "title", null: false
    t.integer "budget_cents", default: 0, null: false
    t.string "budget_currency", default: "EUR", null: false
    t.index ["user_id"], name: "index_categories_on_user_id"
  end

  create_table "tags", force: :cascade do |t|
    t.integer "user_id"
    t.string "title"
    t.index ["user_id"], name: "index_tags_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "password_digest"
    t.string "primary_currency", default: "EUR", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "accounts", "users"
  add_foreign_key "cash_flows", "accounts"
  add_foreign_key "cash_flows", "categories"
  add_foreign_key "categories", "users"
  add_foreign_key "tags", "users"
end
