# dcp-worker
This is test for building a custom DCP worker.

### Evaluator
The DCP evaluator package and Dockerfile are located under the `evaluator` directory.

### Worker
The DCP worker is located in `index.js`. 

### Docker Setup
The `docker-compose.yaml` file contains the setup. It will launch the evaluator at port `9000:9000`
using the docker network host. It will also launch the worker on the same network to allow fo communication on the host machine.

### Run
1. `docker-compose up evaluator`
1. `docker-compose up dcpworker`

### Issues
I get a connection refused error when the connection to the evaluator is made. 
The code attempts to connect at 127.0.0.1:9000. This is not correct. I attempted to 
alter the host url with:
```javascript
worker = new Worker({
            evaluatorHostname: 'host.docker.internal',
            maxWorkingSandboxes: os.cpus().length * 2 || 3,
            paymentAddress: paymentAddress,
            sandboxOptions: {
                SandboxConstructor: function (code) {
                    return new StandaloneWorker(code, {/* evaluator options */})
                }
            }
        });
```
When I `exec` into `dcpworker` I'm able to reach host.docker.internal:9000 with `curl http://host.docker.internal:9000`.
When the request executes, it's help open. I see some JSON parsing error in the output.

