se2411 logout
se2411 login --username admin --passw admin 
se2411 healthcheck
se2411 resetpasses
se2411 healthcheck
se2411 resetstations
se2411 healthcheck
se2411 admin --addpasses --source passes11.csv
se2411 healthcheck
se2411 tollstationpasses --station AM08 --from 20220514 --to 20220528 --format json
se2411 tollstationpasses --station NAO04 --from 20220514 --to 20220528 --format csv
se2411 tollstationpasses --station NO01 --from 20220514 --to 20220528 --format csv
se2411 tollstationpasses --station OO03 --from 20220514 --to 20220528 --format csv
se2411 tollstationpasses --station XXX --from 20220514 --to 20220528 --format csv
se2411 tollstationpasses --station OO03 --from 20220514 --to 20220528 --format YYY
se2411 errorparam --station OO03 --from 20220514 --to 20220528 --format csv
se2411 tollstationpasses --station AM08 --from 20220515 --to 20220526 --format json
se2411 tollstationpasses --station NAO04 --from 20220515 --to 20220526 --format csv
se2411 tollstationpasses --station NO01 --from 20220515 --to 20220526 --format csv
se2411 tollstationpasses --station OO03 --from 20220515 --to 20220526 --format csv
se2411 tollstationpasses --station XXX --from 20220515 --to 20220526 --format csv
se2411 tollstationpasses --station OO03 --from 20220515 --to 20220526 --format YYY
se2411 passanalysis --stationop AM --tagop NAO --from 20220514 --to 20220528 --format json
se2411 passanalysis --stationop NAO --tagop AM --from 20220514 --to 20220528 --format csv
se2411 passanalysis --stationop NO --tagop OO --from 20220514 --to 20220528 --format csv
se2411 passanalysis --stationop OO --tagop KO --from 20220514 --to 20220528 --format csv
se2411 passanalysis --stationop XXX --tagop KO --from 20220514 --to 20220528 --format csv
se2411 passanalysis --stationop AM --tagop NAO --from 20220515 --to 20220526 --format json
se2411 passanalysis --stationop NAO --tagop AM --from 20220515 --to 20220526 --format csv
se2411 passanalysis --stationop NO --tagop OO --from 20220515 --to 20220526 --format csv
se2411 passanalysis --stationop OO --tagop KO --from 20220515 --to 20220526 --format csv
se2411 passanalysis --stationop XXX --tagop KO --from 20220515 --to 20220526 --format csv
se2411 passescost --stationop AM --tagop NAO --from 20220514 --to 20220528 --format json
se2411 passescost --stationop NAO --tagop AM --from 20220514 --to 20220528 --format csv
se2411 passescost --stationop NO --tagop OO --from 20220514 --to 20220528 --format csv
se2411 passescost --stationop OO --tagop KO --from 20220514 --to 20220528 --format csv
se2411 passescost --stationop XXX --tagop KO --from 20220514 --to 20220528 --format csv
se2411 passescost --stationop AM --tagop NAO --from 20220515 --to 20220526 --format json
se2411 passescost --stationop NAO --tagop AM --from 20220515 --to 20220526 --format csv
se2411 passescost --stationop NO --tagop OO --from 20220515 --to 20220526 --format csv
se2411 passescost --stationop OO --tagop KO --from 20220515 --to 20220526 --format csv
se2411 passescost --stationop XXX --tagop KO --from 20220515 --to 20220526 --format csv
se2411 chargesby --opid NAO --from 20220514 --to 20220528 --format json
se2411 chargesby --opid GE --from 20220514 --to 20220528 --format csv
se2411 chargesby --opid OO --from 20220514 --to 20220528 --format csv
se2411 chargesby --opid KO --from 20220514 --to 20220528 --format csv
se2411 chargesby --opid NO --from 20220514 --to 20220528 --format csv
se2411 chargesby --opid NAO --from 20220515 --to 20220526 --format json
se2411 chargesby --opid GE --from 20220515 --to 20220526 --format csv
se2411 chargesby --opid OO --from 20220515 --to 20220526 --format csv
se2411 chargesby --opid KO --from 20220515 --to 20220526 --format csv
se2411 chargesby --opid NO --from 20220515 --to 20220526 --format csv
