<?php

    class Routes {
        
        private $database = 'routes3';
        private $user = 'postgres';
        private $password = 'dupa.8';
        
        private $db;
        
        function __construct() {
            $this->db = pg_connect("host=localhost dbname=$this->database user=$this->user password=$this->password")
                          or die('Nie można nawiązać połączenia: '.pg_last_error());
        }
        
        function __destruct() {
            pg_close($this->db);
        }
        
        private function convertNodesToNeighborList($ways, $nodes) {
            for($i=0; $i<count($ways); $i++) {
                foreach($nodes[$ways[$i]['source']]['asSource'] as $prevForward) {
                    if($i !== $prevForward)
                        $ways[$i]['prevForward'][] = $prevForward;
                }
                
                if(count($nodes[$ways[$i]['source']]['asTarget']) > 0)
                    foreach($nodes[$ways[$i]['source']]['asTarget'] as $prevBackward) {
                        $ways[$i]['prevBackward'][] = $prevBackward;
                    }
                
                if(count($nodes[$ways[$i]['target']]['asSource']) > 0)
                    foreach($nodes[$ways[$i]['target']]['asSource'] as $nextForward) {
                        $ways[$i]['nextForward'][] = $nextForward;
                    }
                
                foreach($nodes[$ways[$i]['target']]['asTarget'] as $nextBackward) {
                    if($i !== $nextBackward)
                        $ways[$i]['nextBackward'][] = $nextBackward;
                }
                
                unset($ways[$i]['source']);
                unset($ways[$i]['target']);
            }
            
            return $ways;
        }
        
        function getWays() {
            $ways  = array();
            $nodes = array();
            $query = 'SELECT source, target, my_is_oneway(reverse_cost) AS oneway, ST_AsGeoJSON(geom_way) AS geom
                        FROM hh_2po_4pgr
                        WHERE clazz > 10 AND clazz < 50 AND clazz != 41';
            
            
            $result = pg_query($query)
                    or die('Nieprawidłowe zapytanie: '.pg_last_error());
            
            $i=0;
            while($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
                //data lifting
                $geom = json_decode($row['geom']);
                $row['geom'] = $geom->coordinates;
                
                $ways [] = $row;
                $nodes[$row['source']]['asSource'][] = $i;
                $nodes[$row['target']]['asTarget'][] = $i;
                $i++;
            }
            pg_free_result($result);
            
            return $this->convertNodesToNeighborList($ways, $nodes);
        }
        
    }

?>