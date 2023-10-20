const dns = require('node:dns');
const fs = require('fs');
const path = require('path');

function getNameServer ( $domain ) {

    dns.resolveNs( $domain, ( err, addresses ) => {

        if ( err ) {

            console.error(err);
            return;
        }

		console.log( $domain + " : " + addresses[0] );
		saveToFile ( $domain, addresses[0] )

    } );
}

function getDomains () {

	const filePath 		= path.join(__dirname, 'zoneSearch.csv');
	const fileContent 	= fs.readFileSync(filePath, 'utf-8');
	const lines 		= fileContent.split( '\n' );

	let tld = lines.map( line => line.split( ';' )[0].replace( /"/g, '' ) );

	tld.shift();

	return tld;
}

function saveToFile ( domain, nameServer ) {

	const filePath = path.join( __dirname, 'nameservers.csv' );
	const fileContent = `${ domain };${ nameServer }\n`;

	fs.appendFileSync( filePath, fileContent );

}

const tlds = getDomains();

tlds.forEach( ( tld ) => {

	dns.resolveNs( tld, ( err, addresses ) => {

        if (err) {
            saveToFile( tld, "no such host" );
            return;
		}

		saveToFile( tld, addresses[0] );

	} );

} );
