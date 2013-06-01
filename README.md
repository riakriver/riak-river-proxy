riak-river-proxy
================

Proxy point for clients. Handles authentication and load balancing to client riak clusters.

Authentication
--------------

Clients will set a `Authorization: 830ee0f1de5868c949809fa6cbe3595a120b79e9`
header in requests. This will be check against the specific cluster
defined in the `X-Cluster-Id: cluster12345` which also must be set in
the client request headers.

###Error Responses

* 400 - a cluster id wasn't provided
* 401 - a valid authorization value wasn't provied
* 404 - the cluster id did not exist
