Pagination:

https://stackoverflow.com/a/61451760/12743194

To do:

- display successful sign up message
- redirect on 404
- Add auto logout
- Authenticate with auth0

---

Developed using Node 14 LTS. Other versions may work but are not recommended or tested.

The database has been migrated and one SQL file containing the whole database will be provided inside a folder in the root of this project, titled "IMPORT".
If you wish to run these scripts manually, please ensure that the .zip.00x files containing the dataset is extracted using the "Extract here" option from the context menu. If one is to extract using a different method, the migration scripts may not work as they require a specific path.

The scripts can be run by opening command prompt inside the folder containing the scritps, i.e. "project root/migrateData", and entering the following command: "node [name of script]", e.g. "node createFilmsTable".

Each script must be run in a specific order:

1. createDatabase
2. createCountryTable / createFilmsTable / createGenreTable / createPeopleTable / createProductionCompanyTable
3. createFilmActorsTable / createFilmCountryTable / createFilmDirectorTable / createFilmGenreTable / createFilmProductionCompanyTable / createFilmWriterTable
