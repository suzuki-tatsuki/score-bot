use calamine::{open_workbook, Reader, Xlsx, Data};

#[derive(Debug)]
pub struct ExcelData {
    pub kyoku_num: String,
    pub score: Vec<f64>,
}

pub fn read_excel() -> ExcelData {
    let xl_book_path = "data.xlsx";
    let mut workbook: Xlsx<_> = open_workbook(xl_book_path).expect("cannot open xl book");

    let mut score = vec![0.0, 0.0, 0.0, 0.0];

    if let Ok(range) = workbook.worksheet_range("Sheet1") {
        for row in 1..5 {
            let cell_value = range.get_value((row as u32, 8));


            match cell_value {
                Some(Data::Float(cell_value)) => {
                    score[row-1] = *cell_value;
                },
                _ => println!("Not a float value or empty"),
            }

        }
    } else {
        eprintln!("Error: Cannot find 'sheet name'");
    }

    ExcelData {
        kyoku_num: String::from("0本場"),
        score,
    }
}
