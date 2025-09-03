import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit, Trash2, RefreshCw } from 'lucide-react';
import { formatRUT } from '@/lib/rut';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Developer } from '@/features/developers/schemas';

interface DevelopersTableProps {
  developers: Developer[];
  onView: (developer: Developer) => void;
  onEdit: (developer: Developer) => void;
  onDelete: (developer: Developer) => void;
  onReactivate: (developer: Developer) => void;
  isLoading?: boolean;
}

export default function DevelopersTable({
  developers,
  onView,
  onEdit,
  onDelete,
  onReactivate,
  isLoading = false,
}: DevelopersTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (developers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No hay desarrolladores registrados</p>
        <p className="text-muted-foreground text-sm">Agrega el primer desarrollador para comenzar</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: es });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>RUT</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Fecha Contratación</TableHead>
            <TableHead>Experiencia</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-[80px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {developers.map((developer) => (
            <TableRow key={developer.codigoDesarrollador}>
              <TableCell className="font-medium">
                {developer.nombre}
              </TableCell>
              <TableCell>
                {formatRUT(developer.rut)}
              </TableCell>
              <TableCell>
                {developer.correoElectronico}
              </TableCell>
              <TableCell>
                {formatDate(developer.fechaContratacion)}
              </TableCell>
              <TableCell>
                {developer.aniosExperiencia} años
              </TableCell>
              <TableCell>
                <Badge 
                  variant={developer.registroActivo ? "default" : "secondary"}
                >
                  {developer.registroActivo ? 'Activo' : 'Inactivo'}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(developer)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalles
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(developer)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    {developer.registroActivo ? (
                      <DropdownMenuItem 
                        onClick={() => onDelete(developer)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Desactivar
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem 
                        onClick={() => onReactivate(developer)}
                        className="text-green-600"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reactivar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
