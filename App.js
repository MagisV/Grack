// App.js
import { useCallback, useEffect } from "react";
import AppNavigator from "./components/AppNavigator";
import { createTables, connectToDatabase } from "./database/Schema";
import { seedDatabase } from "./database/Seeder";
import { SEED, DB_NAME } from "./constants";
import { SQLiteProvider } from 'expo-sqlite';

const App = () => {

    const initialiseDatabase = useCallback(async () => {
        try {
            const db = await connectToDatabase(DB_NAME);
            await createTables(db);
            if (SEED) {
                // Seed the database, runs if no data is present or RE_SEED is true
                await seedDatabase(db);
            }
        } catch (error) {
            console.error('Error initializing database: ', error);
        }
    }, []);

    useEffect(() => {
        console.log('initialising database on first load')
        initialiseDatabase();
    }, []);

    return (
        <SQLiteProvider databaseName={DB_NAME}>
            <AppNavigator />
        </SQLiteProvider>
    );
};

export default App;
