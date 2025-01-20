import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function TablePending({ cols }: { cols: number }) {
    return (
        <TableBody>
            <TableRow>
                {Array.from({ length: cols }).map((item, index) => (
                    <TableCell key={index}>
                        <Skeleton className="h-6 w-[100px]" />
                    </TableCell>
                ))}
            </TableRow>
        </TableBody>
    )
}

