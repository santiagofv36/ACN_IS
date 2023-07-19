namespace ReactVentas.DTOs
{
    public class OrdenCompraDTO
    {
        public DateTime Fecha { get; set; }
        public List<ItemOrdenCompraDTO> Items { get; set; }
    }

    public class ItemOrdenCompraDTO
    {
        public int ProductoId { get; set; }
        public string ProductoNombre { get; set; }
        public decimal PrecioUnitario { get; set; }
        public int Cantidad { get; set; }
    }
}
