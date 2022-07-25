# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#

user = User.create!(name: 'Federico', email: 'fede.mz@gmail.com', password: 'password1')
['Efectivo', 'Banco Sabadell', 'Banco BBVA', 'Tarjeta Credito', 'Inversiones'].each do |account|
  Account.create!(user: user, title: account, currency: user.primary_currency)
end
['Alquiler', 'Servicios', 'Salud', 'Educación', 'Super', 'Movilidad',
 'Entretenimiento', 'Ropa', 'Trabajo', 'Impuestos/Tasas', 'Otros', 'Balance'].each do |category|
  Category.create!(user: user, title: category)
end
['Comida', 'Hogar', 'Combustible', 'Arreglo'].each do |tag|
  Tag.create!(user: user, title: tag)
end
