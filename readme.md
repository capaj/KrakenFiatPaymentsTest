# Kraken coding test for backend engineer

## How to run

Just `docker-compose up`.

## Why did I choose Prisma?

This could have been implemented without an ORM or with objection/typeorm/MikroOrm and myriads of others.
I've only worked with prisma once before but it captivated me with it's DX and typesafety. Performance wise there would be a way to make it considerably faster by writing raw queries/prepared statements, but since performance was not mentioned in the readme, I went with prisma to save some time. If you wish me to make this faster please let me know what throughput you need and I can make my best to try and achieve it.
