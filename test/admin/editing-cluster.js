function editingCluster() {
  it('should be able to update the auth key');
  describe('editing ssl https properties', function() {
    it('should be able to toggle the https flag');
    it('should be able to change key');
    it('should be able to change cert');
  });
  describe('editing nodes in a cluster', function() {
    it('should be able to add a node in the cluster');
    it('should be able to delete a node in the cluster');
    describe('editing node', function() {
      it('should be able to update the host');
      it('should be able to update the port');
    });
  });
  describe('load balancing', function() {
    it('should be able to change the load balancing algorithm');
    it('should test the load balancing algorithms');
  });
}

module.exports = editingCluster;
