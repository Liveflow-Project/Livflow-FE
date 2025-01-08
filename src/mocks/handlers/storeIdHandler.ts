import { HttpResponse, http } from 'msw';

type StoreIdResponse = {
  store_id: string; // UUID
  name: string;
  address?: string;
};

type StoreIdDetailResponse = {
  date_info: DayInfo[];
};

type DayInfo = {
  day: number;
  day_info: DayTransaction;
};

type DayTransaction = {
  expense?: DayDetailTransaction[];
  income?: DayDetailTransaction[];
};

type DayDetailTransaction = {
  transaction_id: string; // UUID
  category: string;
  detail: string;
  cost: number;
};

type StoreDetailParams = {
  year: number;
  month: number;
};

type AddTransactionParams = {
  year: number;
  month: number;
  day: number;
  day_info: {
    expense?: DayDetailTransaction[];
    income?: DayDetailTransaction[];
  };
};

type DeleteTransactionParams = {
  transaction_id: string;
};

const STORE_IDS = {
  STORE_1: '0a6e3e2a-0bea-4cda-9f7d-9141ea5efa33',
  STORE_2: '1b7f4f3b-1cfb-5de4-0g8e-0252fb6efb44',
  STORE_3: 'a0b8035d-5499-4adb-9d8a-d7a93ac026e8',
};

const MOCK_STORE_ID: StoreIdResponse[] = [
  {
    // 스토어 아이디
    store_id: STORE_IDS.STORE_1,
    // 스토어 이름
    name: '스토어 이름 1',
    // 스토어 주소 (선택)
    address: '스토어 주소 1',
  },
  {
    // 스토어 아이디
    store_id: STORE_IDS.STORE_2,
    // 스토어 이름
    name: '스토어 이름 2',
    // 스토어 주소 (선택)
    address: '스토어 주소 2',
  },
  {
    // 스토어 아이디
    store_id: STORE_IDS.STORE_3,
    // 스토어 이름
    name: '스토어 이름 3',
    // 스토어 주소 (선택)
    address: '스토어 주소 3',
  },
];

const MOCK_STORE_ID_DETAIL: StoreIdDetailResponse[] = [
  {
    // 해당 달에 있는 날짜별 지출, 수입
    // 1일부터 순서대로 배열에 담기고 지출이나 수입이 있는 날짜만 받음
    date_info: [
      {
        // 1일에 있는 상세 지출, 수입 정보
        day: 1,
        day_info: {
          expense: [
            // 1일에 입력 된 상세 지출 정보
            {
              transaction_id: crypto.randomUUID(),
              category: '식비',
              detail: '친구랑 밥',
              cost: 30000,
            },
            {
              transaction_id: crypto.randomUUID(),
              category: '교통비',
              detail: '서울 여행',
              cost: 30000,
            },
          ],
        },
      },
      {
        // 1일에 있는 상세 지출, 수입 정보
        day: 2,
        day_info: {
          expense: [
            // 2일에 입력 된 상세 지출 정보 전체
            {
              transaction_id: crypto.randomUUID(),
              category: '식비',
              detail: '친구랑 밥',
              cost: 30000,
            },
            {
              transaction_id: crypto.randomUUID(),
              category: '식비',
              detail: '친구랑 밥',
              cost: 30000,
            },
          ],
          income: [
            // 2일에 입력 된 상세 수입 정보 전체
            {
              transaction_id: crypto.randomUUID(),
              category: '급여',
              detail: '11월 급여',
              cost: 2000000,
            },
            {
              transaction_id: crypto.randomUUID(),
              category: '급여',
              detail: '11월 급여',
              cost: 2000000,
            },
          ],
        },
      },
      {
        // 3일에 있는 상세 지출, 수입 정보
        day: 3,
        day_info: {
          expense: [
            // 3일에 입력 된 상세 지출 정보 전체
            {
              transaction_id: crypto.randomUUID(),
              category: '식비',
              detail: '친구랑 밥',
              cost: 30000,
            },
            {
              transaction_id: crypto.randomUUID(),
              category: '식비',
              detail: '친구랑 밥',
              cost: 30000,
            },
          ],
          income: [
            // 3일에 입력 된 상세 수입 정보 전체
            {
              transaction_id: crypto.randomUUID(),
              category: '급여',
              detail: '11월 급여',
              cost: 2000000,
            },
            {
              transaction_id: crypto.randomUUID(),
              category: '급여',
              detail: '11월 급여',
              cost: 2000000,
            },
          ],
        },
      },
      {
        // 10일에 있는 상세 지출, 수입 정보
        day: 10,
        day_info: {
          expense: [
            // 3일에 입력 된 상세 지출 정보 전체
            {
              transaction_id: crypto.randomUUID(),
              category: '영화',
              detail: '친구랑 영화',
              cost: 30000,
            },
            {
              transaction_id: crypto.randomUUID(),
              category: '식비',
              detail: '친구랑 밥',
              cost: 30000,
            },
          ],
          income: [
            // 3일에 입력 된 상세 수입 정보 전체
            {
              transaction_id: crypto.randomUUID(),
              category: '급여',
              detail: '11월 급여',
              cost: 2000000,
            },
            {
              transaction_id: crypto.randomUUID(),
              category: '급여',
              detail: '11월 급여',
              cost: 2000000,
            },
          ],
        },
      },
    ],
  },
  {
    // 해당 달에 있는 날짜별 지출, 수입
    // 1일부터 순서대로 배열에 담기고 지출이나 수입이 있는 날짜만 받음
    date_info: [
      {
        // 1일에 있는 상세 지출, 수입 정보
        day: 21,
        day_info: {
          expense: [
            // 1일에 입력 된 상세 지출 정보
            {
              transaction_id: crypto.randomUUID(),
              category: '식비',
              detail: '친구랑 밥',
              cost: 30000,
            },
            {
              transaction_id: crypto.randomUUID(),
              category: '식비',
              detail: '친구랑 밥',
              cost: 30000,
            },
          ],
          income: [
            // 1일에 입력 된 상세 수입 정보
            {
              transaction_id: crypto.randomUUID(),
              category: '급여',
              detail: '11월 급여',
              cost: 2000000,
            },
            {
              transaction_id: crypto.randomUUID(),
              category: '급여',
              detail: '11월 급여',
              cost: 2000000,
            },
          ],
        },
      },
      {
        // 1일에 있는 상세 지출, 수입 정보
        day: 23,
        day_info: {
          expense: [
            // 2일에 입력 된 상세 지출 정보 전체
            {
              transaction_id: crypto.randomUUID(),
              category: '식비',
              detail: '친구랑 밥',
              cost: 30000,
            },
            {
              transaction_id: crypto.randomUUID(),
              category: '식비',
              detail: '친구랑 밥',
              cost: 30000,
            },
          ],
          income: [
            // 2일에 입력 된 상세 수입 정보 전체
            {
              transaction_id: crypto.randomUUID(),
              category: '급여',
              detail: '11월 급여',
              cost: 2000000,
            },
            {
              transaction_id: crypto.randomUUID(),
              category: '급여',
              detail: '11월 급여',
              cost: 2000000,
            },
          ],
        },
      },
      {
        // 3일에 있는 상세 지출, 수입 정보
        day: 3,
        day_info: {
          expense: [
            // 3일에 입력 된 상세 지출 정보 전체
            {
              transaction_id: crypto.randomUUID(),
              category: '식비',
              detail: '친구랑 밥',
              cost: 30000,
            },
            {
              transaction_id: crypto.randomUUID(),
              category: '식비',
              detail: '친구랑 밥',
              cost: 30000,
            },
          ],
          income: [
            // 3일에 입력 된 상세 수입 정보 전체
            {
              transaction_id: crypto.randomUUID(),
              category: '급여',
              detail: '11월 급여',
              cost: 2000000,
            },
            {
              transaction_id: crypto.randomUUID(),
              category: '급여',
              detail: '11월 급여',
              cost: 2000000,
            },
          ],
        },
      },
    ],
  },
];

export const storeIdHandler = [
  // 스토어 이름, 주소 정보 조회
  http.get('/stores/:id', ({ params }) => {
    const store = MOCK_STORE_ID.find((store) => store.store_id === params.id);

    if (!store) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(store);
  }),

  // 스토어 상세 정보 조회 (달력 데이터)
  http.post('/stores/detail/:id', async ({ params, request }) => {
    const storeDetail =
      MOCK_STORE_ID_DETAIL[
        MOCK_STORE_ID.findIndex((store) => store.store_id === params.id)
      ];

    if (!storeDetail) {
      return new HttpResponse(null, { status: 404 });
    }

    const { year, month } = (await request.json()) as StoreDetailParams;

    return HttpResponse.json({
      year,
      month,
      ...storeDetail,
    });
  }),

  // 스토어 지출, 수입 정보 추가
  http.post('/stores/:id/transaction', async ({ params, request }) => {
    const transactionData = (await request.json()) as AddTransactionParams;
    const storeDetail =
      MOCK_STORE_ID_DETAIL[
        MOCK_STORE_ID.findIndex((store) => store.store_id === params.id)
      ];

    if (!storeDetail) {
      return new HttpResponse(null, { status: 404 });
    }

    // 해당 날짜의 데이터가 있는지 확인
    const dayIndex = storeDetail.date_info.findIndex(
      (info) => info.day === transactionData.day
    );

    if (dayIndex === -1) {
      storeDetail.date_info.push({
        day: transactionData.day,
        day_info: {
          expense:
            transactionData.day_info.expense?.map((exp) => ({
              ...exp,
              transaction_id: crypto.randomUUID(),
            })) || [],
          income:
            transactionData.day_info.income?.map((inc) => ({
              ...inc,
              transaction_id: crypto.randomUUID(),
            })) || [],
        },
      });
    } else {
      const existingDayInfo = storeDetail.date_info[dayIndex].day_info;
      existingDayInfo.expense = [
        ...(existingDayInfo.expense || []),
        ...(transactionData.day_info.expense?.map((exp) => ({
          ...exp,
          transaction_id: crypto.randomUUID(),
        })) || []),
      ];
      existingDayInfo.income = [
        ...(existingDayInfo.income || []),
        ...(transactionData.day_info.income?.map((inc) => ({
          ...inc,
          transaction_id: crypto.randomUUID(),
        })) || []),
      ];
    }

    return HttpResponse.json({
      success: true,
      message: '거래가 성공적으로 추가되었습니다.',
      data: storeDetail,
    });
  }),

  // 스토어 지출, 수입 정보 수정
  http.put('/stores/:id/transaction', async ({ params, request }) => {
    const updateData = (await request.json()) as AddTransactionParams;
    const storeDetail =
      MOCK_STORE_ID_DETAIL[
        MOCK_STORE_ID.findIndex((store) => store.store_id === params.id)
      ];

    if (!storeDetail) {
      return new HttpResponse(null, { status: 404 });
    }

    const dayIndex = storeDetail.date_info.findIndex(
      (info) => info.day === updateData.day
    );

    if (dayIndex === -1) {
      return new HttpResponse(null, {
        status: 404,
        statusText: '해당 날짜의 거래 정보를 찾을 수 없습니다.',
      });
    }

    storeDetail.date_info[dayIndex].day_info = {
      expense: updateData.day_info.expense || [],
      income: updateData.day_info.income || [],
    };

    return HttpResponse.json({
      success: true,
      message: '거래가 성공적으로 수정되었습니다.',
      data: storeDetail,
    });
  }),

  // 스토어 지출, 수입 정보 삭제
  http.delete('/stores/:id/transaction', async ({ params, request }) => {
    const deleteData = (await request.json()) as DeleteTransactionParams;
    const storeDetail =
      MOCK_STORE_ID_DETAIL[
        MOCK_STORE_ID.findIndex((store) => store.store_id === params.id)
      ];

    if (!storeDetail) {
      return new HttpResponse(null, { status: 404 });
    }

    // 모든 날짜에서 해당 ID를 가진 거래 찾기
    let isDeleted = false;
    storeDetail.date_info = storeDetail.date_info.filter((dayInfo) => {
      // expense와 income 배열에서 해당 ID를 가진 거래 삭제
      if (dayInfo.day_info.expense) {
        dayInfo.day_info.expense = dayInfo.day_info.expense.filter((t) => {
          if (t.transaction_id === deleteData.transaction_id) {
            isDeleted = true;
            return false;
          }
          return true;
        });
      }
      if (dayInfo.day_info.income) {
        dayInfo.day_info.income = dayInfo.day_info.income.filter((t) => {
          if (t.transaction_id === deleteData.transaction_id) {
            isDeleted = true;
            return false;
          }
          return true;
        });
      }

      // expense와 income이 모두 비어있으면 해당 날짜 제거
      return (
        dayInfo.day_info.expense?.length || dayInfo.day_info.income?.length
      );
    });

    if (!isDeleted) {
      return new HttpResponse(null, {
        status: 404,
        statusText: '해당 거래를 찾을 수 없습니다.',
      });
    }

    return HttpResponse.json({
      success: true,
      message: '거래가 성공적으로 삭제되었습니다.',
      data: storeDetail,
    });
  }),
];
