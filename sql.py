import random
import psycopg2 as pyodbc

cnxn = pyodbc.connect(
    host='localhost',
    port=5432,
    database='secondsupp',
    user='postgres',
    password='qwerty'
)

m = ['category', 'price', 'color', 'size', 'discount', 'amount']

categories = [
    'Sweater',
    'Dress',
    'Hoodies',
    'T-shirt',
    'Flip-flops',
    'Shorts',
    'Skirt',
    'Jeans',
    'Shoes',
    'Coat',
    'High heels',
    'Suit',
    'Cap',
    'Socks',
    'Shirt',
    'Bra',
    'Scarf',
    'Swimsuit',
    'Hat',
    'Gloves',
    'Jacket',
    'Long coat',
    'Boots',
    'Sunglasses',
    'Tie',
    'Polo shirt',
    'Leather jackets',
]
price = random.randint
colors = [
    'black',
    'silver',
    'gray',
    'white',
    'maroon',
    'red',
    'purple',
    'fuchsia',
    'green',
    'lime',
    'olive',
    'yellow',
    'navy',
    'blue',
    'teal',
    'aqua',
]
sizes = ['s', 'xs', 'm', 'l', 'xl', 'xxl']
discounts = random.randint
amount = random.randint

print("\'" + random.choice(categories) + "\'", price(10, 800), "\'" + random.choice(colors) + "\'",
      "\'" + random.choice(sizes) + "\'", discounts(0, 50),
      amount(0, 500), sep=', ')

cursor = cnxn.cursor()
for i in range(0, 50000):
    print(i)
    print(
        cursor.execute(
            "insert into product (category, price, color, size, discount, amount) values (%s,%s,%s,%s,%s,%s)",
            [random.choice(categories),
             price(10, 800),
             random.choice(colors),
             random.choice(sizes),
             discounts(0, 50),
             amount(0, 500)]
        )
    )
cnxn.commit()
