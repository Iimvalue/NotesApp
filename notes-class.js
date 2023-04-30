class Notes{
    dbName = 'Notes';
    dbVersion = 1;
    reverse = false; //Reverse order of display notes

    connect(){
        // connect to indexedDB, create object store(table) as notes
        return new Promise((resolve, reject)=> {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = ()=>{
                let db = request.result;
                if(!db.objectStoreNames.contains('notes')){
                    db.createObjectStore('notes', {keyPath: 'id', autoIncrement:true});
                }
            }

            request.onsuccess = ()=> {
                resolve(request.result);

            }

            request.onerror = () =>{
                reject(request.error.message);
            }

        })};


    async accessStore(mode){
        // access to notes Object store (table) with select specific mode('readwrite' or 'readonly').
        let connect = await this.connect();
        let tx = connect.transaction('notes', mode);
        return tx.objectStore('notes');


    }
    async add(note){
        // add new note
        let accessDB = await this.accessStore('readwrite');
        accessDB.add(note);
    }

    async update(note){
        // update exist note
        let accessDB = await this.accessStore('readwrite');
        accessDB.put(note);
    }

    async all(){
        // show all notes on webpage
        let accessDB = await this.accessStore('readonly');
        return accessDB.openCursor(null, this.reverse ? 'prev' : 'next' ); // will return all rows in table as object
    }

    async delete(noteId){
        //delete exist note
        let accessDB = await this.accessStore('readwrite');
        accessDB.delete(noteId);
    }

    async clear(){
        // clear all notes on webpage
        let accessDB = await this.accessStore('readwrite');
        accessDB.clear()
    }

}