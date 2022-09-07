class Initial < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.string :email, null: false, index: { unique: true }
      t.string :password_digest
      t.string :primary_currency, null: false, default: 'EUR'

      t.timestamps
    end

    create_table :accounts do |t|
      t.references :user, foreign_key: true
      t.string :title, null: false
      t.string :currency, null: false

      t.timestamps
    end

    create_table :categories do |t|
      t.references :user, foreign_key: true
      t.string :title, null: false
      t.monetize :budget
    end

    create_table :tags do |t|
      t.references :user, foreign_key: true
      t.string :title
    end

    create_table :cash_flows do |t|
      t.references :account, foreign_key: true
      t.references :category, foreign_key: true
      t.string :description
      t.date :flow_date, null: false, index: true
      t.monetize :amount, amount: { null: false }, currency: { null: false }
      t.boolean :is_balance, null: false, default: false
      t.boolean :is_annualized, null: false, default: false

      t.timestamps
    end

    create_join_table :cash_flows, :tags do |t|
      t.index :cash_flow_id
      t.index :tag_id
      t.index [:cash_flow_id, :tag_id], unique: true
    end

  end
end
